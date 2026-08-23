Recommend one decarbonization lever for each hotspot below, using its diagnosed
driver. Return one result per hotspot in a `recommendations` array, each keyed
by `hotspotId` set to that hotspot's `id`. Do not add, drop, or merge hotspots.

Hotspots (JSON, one object per line):
{{triggerNode_1.output.hotspots}}

Diagnoses (from the previous step):
{{InstructorLLMNode_diagnose.output.diagnoses}}
