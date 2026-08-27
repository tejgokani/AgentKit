/*
 * # Carbon Advisor
 *
 * The judgment layer of the Cloud Carbon Advisor kit, exported from Lamatic
 * Studio. The Next.js app computes an emissions footprint deterministically and
 * sends the ranked hotspots here; this flow decides *why* each hotspot emits
 * what it does and *which lever* would cut it — and returns that judgment as
 * enums, never as a number.
 *
 *   trigger (API Request)
 *     → Generate JSON (structured LLM)  diagnoses[] + recommendations[]
 *     → response                        { diagnoses, recommendations }
 *
 * The single structured-output node returns one diagnosis and one
 * recommendation per hotspot, keyed by hotspotId. The app then validates every
 * enum, drops any invented id, and prices each recommendation from a fixed,
 * unit-tested table — so no number in a report ever originates in the model.
 *
 * Inline prompt text and the model config are externalized as @references
 * (resolved by Studio); the JSON output schema stays inline as part of the flow
 * contract.
 */

// Flow: carbon-advisor

const generateJsonSchema = `{
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
    },
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
          "reductionKey": { "type": "string", "enum": ["region-migration-major", "region-migration-partial", "rightsize-major", "rightsize-moderate", "schedule-shift", "storage-tier", "arm-migration", "eliminate-full", "none", "unknown"] }
        },
        "additionalProperties": true
      }
    }
  }
}`;

const flowConfig = {
  id: "edf0967e-e90c-4d3e-a20e-5f3fbdaf93b4",
  name: "carbon-advisor",
  status: "active",
  edges: [
    {
      id: "triggerNode_1-InstructorLLMNode_505",
      type: "defaultEdge",
      source: "triggerNode_1",
      target: "InstructorLLMNode_505",
      sourceHandle: "bottom",
      targetHandle: "top",
    },
    {
      id: "InstructorLLMNode_505-responseNode_triggerNode_1",
      type: "defaultEdge",
      source: "InstructorLLMNode_505",
      target: "responseNode_triggerNode_1",
      sourceHandle: "bottom",
      targetHandle: "top",
    },
    {
      id: "response-trigger_triggerNode_1",
      type: "responseEdge",
      source: "triggerNode_1",
      target: "responseNode_triggerNode_1",
      sourceHandle: "to-response",
      targetHandle: "from-trigger",
    },
  ],
  nodes: [
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
          advance_schema: `{
  "hotspots": "[string]",
  "periodLabel": "string",
  "currency": "string"
}`,
        },
      },
    },
    {
      id: "InstructorLLMNode_505",
      type: "dynamicNode",
      position: { x: 0, y: 130 },
      data: {
        nodeId: "InstructorLLMNode",
        values: {
          id: "InstructorLLMNode_505",
          nodeName: "Generate JSON",
          schema: generateJsonSchema,
          prompts: [
            { id: "carbon-advisor-generate-json-system", role: "system", content: "@prompts/carbon-advisor_generate-json_system.md" },
            { id: "carbon-advisor-generate-json-user", role: "user", content: "@prompts/carbon-advisor_generate-json_user.md" },
          ],
          memories: "[]",
          messages: "[]",
          generativeModelName: "@model-configs/carbon-advisor_generate-json.ts",
        },
      },
    },
    {
      id: "responseNode_triggerNode_1",
      type: "responseNode",
      position: { x: 0, y: 260 },
      data: {
        nodeId: "graphqlResponseNode",
        isResponseNode: true,
        values: {
          id: "responseNode_triggerNode_1",
          nodeName: "API Response",
          headers: '{"content-type":"application/json"}',
          retries: "0",
          retry_delay: "0",
          webhookUrl: "",
          outputMapping: `{
  "diagnoses": "{{InstructorLLMNode_505.output.diagnoses}}",
  "recommendations": "{{InstructorLLMNode_505.output.recommendations}}"
}`,
        },
      },
    },
  ],
};

export async function getNodesAndEdges(): Promise<{
  nodes: Record<string, unknown>[];
  edges: Record<string, unknown>[];
}> {
  return { nodes: flowConfig.nodes, edges: flowConfig.edges };
}

export async function getFlowConfig(): Promise<Record<string, unknown>> {
  return flowConfig;
}

export default flowConfig;
