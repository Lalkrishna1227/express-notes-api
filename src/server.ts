import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const app = express();
app.use(cors());
app.use(express.json());

const notes = new Map<string, Note>();
let nextId = 1;

function createId(): string {
  const id = String(nextId);
  nextId += 1;
  return id;
}

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// List all notes
app.get('/notes', (_req: Request, res: Response) => {
  res.json(Array.from(notes.values()));
});

// Get a single note
app.get('/notes/:id', (req: Request, res: Response) => {
  const note = notes.get(req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

// Create a note
app.post('/notes', (req: Request, res: Response) => {
  const { title, content } = req.body ?? {};

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' });
  }

  const now = new Date().toISOString();
  const note: Note = {
    id: createId(),
    title: title.trim(),
    content,
    createdAt: now,
    updatedAt: now,
  };

  notes.set(note.id, note);
  res.status(201).json(note);
});

// Update a note
app.put('/notes/:id', (req: Request, res: Response) => {
  const existing = notes.get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const { title, content } = req.body ?? {};

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }
  if (content !== undefined && typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' });
  }

  const updated: Note = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    content: content !== undefined ? content : existing.content,
    updatedAt: new Date().toISOString(),
  };

  notes.set(updated.id, updated);
  res.json(updated);
});

// Archive a note
app.post('/notes/:id/archive', (req: Request, res: Response) => {
  const existing = notes.get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Note not found' });
  }

  existing.archived = true;
  notes.set(existing.id, existing);
  res.json(existing);
});

// Delete a note
app.delete('/notes/:id', (req: Request, res: Response) => {
  const existed = notes.delete(req.params.id);
  if (!existed) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.status(204).send();
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('express-notes-api listening on port ' + PORT);
  });
}

export default app;
