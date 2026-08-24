const promptConfig = {
  "id": "47123337-316e-4f8f-b4a4-93eb46015817",
  "name": "carbon-advisor",
  "config": {
    "values": {
      "tools": [],
      "prompts": [
        {
          "id": "187c2f4b-c23d-4545-abef-73dc897d6b7b",
          "role": "system",
          "content": "You are an AI Assistant"
        },
        {
          "id": "187c2f4b-c23d-4545-abef-73dc897d6b7d",
          "role": "user",
          "content": "Write your prompt here"
        }
      ],
      "memories": "[]",
      "messages": "[]",
      "nodeName": "carbon-advisor",
      "attachments": "",
      "credentials": "",
      "generativeModelName": [
        {
          "type": "generator/text",
          "params": {},
          "configName": "configA",
          "provider_name": "",
          "credential_name": ""
        }
      ]
    }
  },
  "type": "LLMNode",
  "status": "inactive",
  "created_at": "2026-08-23T16:57:36.183241+00:00"
};

export async function getPromptConfig(): Promise<Record<string, any>> {
    return promptConfig;
}