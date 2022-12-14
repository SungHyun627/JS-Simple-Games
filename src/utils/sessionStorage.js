export const setBestScoreInSession = (bestScore) => sessionStorage.setItem('bestScore', bestScore);

export const getBestScoreFromSession = () => {
  const bestScore = sessionStorage.getItem('bestScore');
  if (bestScore === null) this.setBestScoreInSession(0);
  return bestScore !== null ? sessionStorage.getItem('bestScore') : 0;
};
