export const modelOptions = [
  'mistral-small-latest',
  'mistral-medium-latest',
  'devstral-small-latest',
  'magistral-small-latest'
] as const;

export type ModelOptions = typeof modelOptions[number];

type Model =  {
    value: ModelOptions;
    label: string;
    desc: string;
}

export const ModelList: Model[]  = [
    {
        value: 'mistral-small-latest',
        label: "Mistral Small 3.2",
        desc: "Fast answers"
    },
    {
        value: 'mistral-medium-latest',
        label: "Mistral Medium",
        desc: "Think longer for better answers"
    },
    {
        value: 'devstral-small-latest',
        label: "Devstral Small 1.1",
        desc: "Better coding"
    },
    {
        value: 'magistral-small-latest',
        label: "Magistral Small 1.1",
        desc: "Reasoning model"
    }
]

export const getModelLabel = (m: string) => {
    for(let i = 0; i < ModelList.length; i++) {
        if(ModelList[i].value === m) {
            return ModelList[i].label
        }
    }
}

export const AllModels = ModelList.map(m => ({
  value: m.value,
  label: m.label,
  desc: m.desc
}));