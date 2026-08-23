// Model config: recommend (InstructorLLMNode). Structured-output selection of a
// decarbonization lever per hotspot. Slightly higher temperature than diagnose
// to allow for varied, concrete action phrasing — but still returning only a
// fixed `reductionKey` bucket, never a number.
//
// `credentialId` is bound to your own Gemini credential by Lamatic Studio when
// you attach it to the node; the value below is a placeholder overwritten on
// export.
export default {
  generativeModelName: [
    {
      type: "generator/text",
      params: { temperature: 0.2 },
      configName: "configA",
      model_name: "gemini-3.5-flash-lite",
      credentialId: "00000000-0000-0000-0000-000000000000",
      provider_name: "gemini",
      credential_name: "Gemini Keys",
    },
  ],
};
