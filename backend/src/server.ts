import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Load seed data as database baseline
const seedPath = path.resolve(__dirname, '../../frontend/src/data/seedData.json');
let db = {
  users: [] as any[],
  clubs: [] as any[],
  memberships: [] as any[],
  activities: [] as any[],
  registrations: [] as any[],
  boardPosts: [] as any[],
  postComments: [] as any[],
  auditLogs: [] as any[]
};

if (fs.existsSync(seedPath)) {
  db = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'Vida Universitaria Ulima API', version: '1.0.0' });
});

// CLUBS
app.get('/api/clubs', (req: Request, res: Response) => {
  const { category, status } = req.query;
  let result = db.clubs;
  if (category && category !== 'Todas') {
    result = result.filter(c => c.category === category);
  }
  if (status) {
    result = result.filter(c => c.status === status);
  }
  res.json(result);
});

app.get('/api/clubs/:id', (req: Request, res: Response) => {
  const club = db.clubs.find(c => c.id === req.params.id);
  if (!club) return res.status(404).json({ error: 'Club no encontrado' });
  res.json(club);
});

app.post('/api/clubs', (req: Request, res: Response) => {
  const newClub = {
    ...req.body,
    id: `club-${Date.now()}`,
    status: 'under_review',
    memberCount: 1
  };
  db.clubs.push(newClub);
  res.status(201).json(newClub);
});

app.patch('/api/clubs/:id', (req: Request, res: Response) => {
  const idx = db.clubs.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Club no encontrado' });
  db.clubs[idx] = { ...db.clubs[idx], ...req.body };
  res.json(db.clubs[idx]);
});

// ACTIVITIES
app.get('/api/activities', (req: Request, res: Response) => {
  const { clubId, category } = req.query;
  let result = db.activities;
  if (clubId) result = result.filter(a => a.clubId === clubId);
  if (category && category !== 'Todas') result = result.filter(a => a.category === category);
  res.json(result);
});

app.get('/api/activities/:id', (req: Request, res: Response) => {
  const act = db.activities.find(a => a.id === req.params.id);
  if (!act) return res.status(404).json({ error: 'Actividad no encontrada' });
  res.json(act);
});

app.post('/api/activities', (req: Request, res: Response) => {
  const newAct = {
    ...req.body,
    id: `act-${Date.now()}`,
    enrolledCount: 0,
    status: 'scheduled'
  };
  db.activities.push(newAct);
  res.status(201).json(newAct);
});

// REGISTRATIONS & ATTENDANCE
app.get('/api/registrations', (req: Request, res: Response) => {
  const { activityId, userId } = req.query;
  let result = db.registrations;
  if (activityId) result = result.filter(r => r.activityId === activityId);
  if (userId) result = result.filter(r => r.userId === userId);
  res.json(result);
});

app.post('/api/registrations', (req: Request, res: Response) => {
  const { activityId, userId, userName, userEmail, userCode, userCareer } = req.body;
  const act = db.activities.find(a => a.id === activityId);
  if (!act) return res.status(404).json({ error: 'Actividad no encontrada' });

  const isFull = act.enrolledCount >= act.capacity;
  const status = isFull ? 'waitlist' : 'confirmed';
  const prefix = isFull ? 'WAIT' : 'ULIMA';
  const ticketCode = `${prefix}-${act.title.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newReg = {
    id: `reg-${Date.now()}`,
    activityId,
    userId,
    userName,
    userEmail,
    userCode,
    userCareer,
    status,
    registeredAt: new Date().toISOString(),
    ticketCode
  };

  db.registrations.push(newReg);
  if (status === 'confirmed') {
    act.enrolledCount += 1;
  }
  res.status(201).json({ registration: newReg, isWaitlist: isFull });
});

app.patch('/api/registrations/:id/attendance', (req: Request, res: Response) => {
  const reg = db.registrations.find(r => r.id === req.params.id);
  if (!reg) return res.status(404).json({ error: 'Inscripción no encontrada' });
  reg.attendanceStatus = req.body.attendanceStatus;
  res.json(reg);
});

// CSV EXPORT
app.get('/api/activities/:id/export-attendance', (req: Request, res: Response) => {
  const act = db.activities.find(a => a.id === req.params.id);
  if (!act) return res.status(404).json({ error: 'Actividad no encontrada' });

  const regs = db.registrations.filter(r => r.activityId === act.id);
  const rows = regs.map(r => `"${r.userCode}","${r.userName}","${r.userEmail}","${r.userCareer}","${r.status}","${r.attendanceStatus || 'Sin marcar'}","${r.ticketCode}"`);
  const csv = `"Código","Nombre","Correo","Carrera","Estado","Asistencia","Ticket"\n` + rows.join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="asistencia_${act.id}.csv"`);
  res.send(csv);
});

// USERS & MODERATION
app.get('/api/users', (req: Request, res: Response) => {
  res.json(db.users);
});

app.patch('/api/users/:id/block', (req: Request, res: Response) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  user.isBlocked = req.body.isBlocked;
  user.blockReason = req.body.isBlocked ? req.body.reason : undefined;
  res.json(user);
});

// BOARD POSTS
app.get('/api/clubs/:id/posts', (req: Request, res: Response) => {
  const posts = db.boardPosts.filter(p => p.clubId === req.params.id);
  res.json(posts);
});

app.post('/api/clubs/:id/posts', (req: Request, res: Response) => {
  const newPost = {
    ...req.body,
    id: `post-${Date.now()}`,
    clubId: req.params.id,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    likedBy: []
  };
  db.boardPosts.unshift(newPost);
  res.status(201).json(newPost);
});

app.listen(PORT, () => {
  console.log(`[Vida Universitaria API] Servidor activo en http://localhost:${PORT}`);
});

export default app;
