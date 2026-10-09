// directive/controllers.js
export function home(req, res) {
  return res.render('directive/home', {
    title: 'Portal Directiva de Club | Vida Universitaria Ulima',
    currentPage: 'directive',
    description: 'Panel de administración y gestión para mesas directivas de clubes'
  });
}
