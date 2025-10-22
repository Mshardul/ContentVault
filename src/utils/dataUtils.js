export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getTagsCount = (array) => {
  let tagsCount = {};
  array.forEach(element => {
    const tags = element.tags;
    tags.forEach(tag => {
      if (tag in tagsCount) {
        tagsCount[tag] += 1;
      } else {
        tagsCount[tag] = 1;
      }
    });
  });
  return tagsCount;
}