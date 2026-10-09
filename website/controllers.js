// website/controllers.js
export function home(req, res) {
  return res.render('website/home', {
    title: 'Vida Universitaria - Clubes y Actividades Estudiantiles | Universidad de Lima',
    currentPage: 'home',
    description: 'Plataforma oficial de clubes estudiantiles y actividades extracurriculares de la Universidad de Lima.'
  });
}