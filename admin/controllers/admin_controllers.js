// admin/controllers/admin_controllers.js
export function home(req, res) {
  return res.render('admin/home', {
    title: 'Administración Bienestar Estudiantil | Vida Universitaria Ulima',
    currentPage: 'admin',
    description: 'Panel de supervisión, auditoría y métricas para Bienestar Estudiantil'
  });
}