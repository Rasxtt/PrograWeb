// student/controllers.js
export function home(req, res) {
  return res.render('student/home', {
    title: 'Portal Estudiante | Vida Universitaria Ulima',
    currentPage: 'student',
    description: 'Gestión de perfil, mis clubes e inscripciones a actividades'
  });
}
