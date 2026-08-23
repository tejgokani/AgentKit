/*
 * # Carbon Advisor
 *
 * Judgment layer of the Cloud Carbon Advisor kit. The Next.js app computes an
 * emissions footprint deterministically and sends the ranked hotspots here; this
 * flow decides *why* each hotspot emits what it does and *which lever* would cut
 * it — and returns that judgment as enums, never as a number.
 *
 *   trigger (API Request)
 *     → Diagnose  (InstructorLLM)  driverClass + confidence + evidence
 *     → Recommend (InstructorLLM)  action + effort + risk + reductionKey bucket
 *     → Finalize  (code)           coerce every enum, drop invented ids
 *     → response                   { diagnoses, recommendations }
 *
 * This file is the canonical Lamatic Studio export shape. Import it into Studio,
 * attach your Gemini credential to the two model nodes, deploy, and copy the
 * Flow ID into LAMATIC_CARBON_ADVISOR_FLOW_ID. Prompts, model configs, and the
 * finalize code are externalized via @references and resolved by Studio.
 */

// Flow: carbon-advisor

export const meta = {
  name: "carbon-advisor",
  description:
    "Diagnoses the dominant carbon driver of each cloud usage hotspot and recommends a decarbonization lever — as judgment, never as a number.",
  tags: ["sustainability", "cloud-carbon", "greenops", "finops"],
  testInput: null,
  githubUrl: "",
  documentationUrl: "",
  deployUrl: "",
  author: { name: "", email: "" },
};

export const inputs = {
  InstructorLLMNode_diagnose: [
    { name: "generativeModelName", label: "Generative Model Name", type: "model" },
  ],
  InstructorLLMNode_recommend: [
    { name: "generativeModelName", label: "Generative Model Name", type: "model" },
  ],
};

export const references = {
  constitutions: {
    default: "@constitutions/default.md",
  },
  prompts: {
    carbon_advisor_diagnose_system: "@prompts/carbon-advisor_diagnose_system.md",
    carbon_advisor_diagnose_user: "@prompts/carbon-advisor_diagnose_user.md",
    carbon_advisor_recommend_system: "@prompts/carbon-advisor_recommend_system.md",
    carbon_advisor_recommend_user: "@prompts/carbon-advisor_recommend_user.md",
  },
  modelConfigs: {
    carbon_advisor_diagnose_generative_model_name: "@model-configs/carbon-advisor_diagnose_generative-model-name.ts",
    carbon_advisor_recommend_generative_model_name: "@model-configs/carbon-advisor_recommend_generative-model-name.ts",
  },
  scripts: {
    carbon_advisor_finalize_code: "@scripts/carbon-advisor_finalize.ts",
  },
};

const diagnoseSchema = `{
  "type": "object",
  "properties": {
    "diagnoses": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "hotspotId": { "type": "string" },
          "driverClass": { "type": "string", "enum": ["dirty-grid", "compute-heavy", "storage-bloat", "egress-heavy", "over-provisioned", "mixed"] },
          "confidence": { "type": "string", "enum": ["high", "medium", "low"] },
          "evidence": { "type": "array", "items": { "type": "string" } },
          "reasoning": { "type": "string" },
          "rejectedDrivers": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": { "driver": { "type": "string" }, "whyNot": { "type": "string" } },
              "additionalProperties": true
            }
          }
        },
        "additionalProperties": true
      }
    }
  }
}`;

const recommendSchema = `{
  "type": "object",
  "properties": {
    "recommendations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "hotspotId": { "type": "string" },
          "action": { "type": "string" },
          "rationale": { "type": "string" },
          "effort": { "type": "string", "enum": ["low", "medium", "high"] },
          "risk": { "type": "string", "enum": ["low", "medium", "high"] },
          "prerequisites": { "type": "array", "items": { "type": "string" } },
          "reductionKey": {
            "type": "string",
            "enum": ["region-migration-major", "region-migration-partial", "rightsize-major", "rightsize-moderate", "schedule-shift", "storage-tier", "arm-migration", "eliminate-full", "none", "unknown"]
          }
        },
        "additionalProperties": true
      }
    }
  }
}`;

const triggerSchema = `{
  "hotspots": "[string]",
  "periodLabel": "string",
  "currency": "string"
}`;

const responseMapping = `{
  "diagnoses": "{{codeNode_finalize.output.diagnoses}}",
  "recommendations": "{{codeNode_finalize.output.recommendations}}"
}`;

export const nodes = [
  {
    id: "triggerNode_1",
    type: "triggerNode",
    position: { x: 0, y: 0 },
    data: {
      nodeId: "graphqlNode",
      trigger: true,
      values: {
        id: "triggerNode_1",
        nodeName: "API Request",
        responeType: "realtime",
        advance_schema: triggerSchema,
      },
    },
  },
  {
    id: "InstructorLLMNode_diagnose",
    type: "dynamicNode",
    position: { x: 0, y: 0 },
    data: {
      nodeId: "InstructorLLMNode",
      values: {
        id: "InstructorLLMNode_diagnose",
        schema: diagnoseSchema,
        prompts: [
          { id: "carbon-advisor-diagnose-system", role: "system", content: "@prompts/carbon-advisor_diagnose_system.md" },
          { id: "carbon-advisor-diagnose-user", role: "user", content: "@prompts/carbon-advisor_diagnose_user.md" },
        ],
        memories: "[]",
        nodeName: "Diagnose",
        generativeModelName: "@model-configs/carbon-advisor_diagnose_generative-model-name.ts",
      },
    },
  },
  {
    id: "InstructorLLMNode_recommend",
    type: "dynamicNode",
    position: { x: 0, y: 0 },
    data: {
      nodeId: "InstructorLLMNode",
      values: {
        id: "InstructorLLMNode_recommend",
        schema: recommendSchema,
        prompts: [
          { id: "carbon-advisor-recommend-system", role: "system", content: "@prompts/carbon-advisor_recommend_system.md" },
          { id: "carbon-advisor-recommend-user", role: "user", content: "@prompts/carbon-advisor_recommend_user.md" },
        ],
        memories: "[]",
        nodeName: "Recommend",
        generativeModelName: "@model-configs/carbon-advisor_recommend_generative-model-name.ts",
      },
    },
  },
  {
    id: "codeNode_finalize",
    type: "dynamicNode",
    position: { x: 0, y: 0 },
    data: {
      nodeId: "codeNode",
      values: {
        id: "codeNode_finalize",
        code: "@scripts/carbon-advisor_finalize.ts",
        nodeName: "Finalize",
      },
    },
  },
  {
    id: "responseNode_triggerNode_1",
    type: "responseNode",
    position: { x: 0, y: 0 },
    data: {
      nodeId: "graphqlResponseNode",
      values: {
        id: "responseNode_triggerNode_1",
        nodeName: "",
        outputMapping: responseMapping,
      },
    },
  },
];

export const edges = [
  {
    id: "triggerNode_1-InstructorLLMNode_diagnose",
    source: "triggerNode_1",
    target: "InstructorLLMNode_diagnose",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "defaultEdge",
  },
  {
    id: "InstructorLLMNode_diagnose-InstructorLLMNode_recommend",
    source: "InstructorLLMNode_diagnose",
    target: "InstructorLLMNode_recommend",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "defaultEdge",
  },
  {
    id: "InstructorLLMNode_recommend-codeNode_finalize",
    source: "InstructorLLMNode_recommend",
    target: "codeNode_finalize",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "defaultEdge",
  },
  {
    id: "codeNode_finalize-responseNode_triggerNode_1",
    source: "codeNode_finalize",
    target: "responseNode_triggerNode_1",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "defaultEdge",
  },
  {
    id: "response-responseNode_triggerNode_1",
    source: "triggerNode_1",
    target: "responseNode_triggerNode_1",
    sourceHandle: "to-response",
    targetHandle: "from-trigger",
    type: "responseEdge",
  },
];

export default { meta, inputs, references, nodes, edges };
