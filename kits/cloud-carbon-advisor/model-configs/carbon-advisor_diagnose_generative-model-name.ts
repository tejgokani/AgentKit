// Model config: diagnose (InstructorLLMNode). Structured-output classification
// of each hotspot's dominant carbon driver. Low temperature — this is analysis,
// not generation.
//
// `credentialId` is bound to your own Gemini credential by Lamatic Studio when
// you attach it to the node; the value below is a placeholder from the build and
// is overwritten on export. Swap the model for a stronger one once you've
// verified it works in your Studio project.
export default {
  generativeModelName: [
    {
      type: "generator/text",
      params: { temperature: 0.1 },
      configName: "configA",
      model_name: "gemini-3.5-flash-lite",
      credentialId: "00000000-0000-0000-0000-000000000000",
      provider_name: "gemini",
      credential_name: "Gemini Keys",
    },
  ],
};
