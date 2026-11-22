export const labModels = new Set(['lonar','deccan','st-marys','varkala','meghalayan','majuli','dholavira']);

export const guideUrl = id => `places/${encodeURIComponent(id)}/`;
export const labUrl = id => `?model=${encodeURIComponent(id)}#geo-lab`;
