import request from 'supertest';
import app from './server';

describe('express-notes-api', () => {
  it('returns ok on health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('starts with an empty notes list', async () => {
    const res = await request(app).get('/notes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('creates a note and returns it', async () => {
    const res = await request(app)
      .post('/notes')
      .send({ title: 'Test note', content: 'Hello world' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test note');
    expect(res.body.content).toBe('Hello world');
    expect(res.body.id).toBeDefined();
  });

  it('rejects a note without a title', async () => {
    const res = await request(app).post('/notes').send({ content: 'No title' });
    expect(res.status).toBe(400);
  });

  it('updates and deletes a note', async () => {
    const created = await request(app)
      .post('/notes')
      .send({ title: 'Original', content: 'Original content' });

    const id = created.body.id;

    const updated = await request(app)
      .put(`/notes/${id}`)
      .send({ title: 'Updated title' });

    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('Updated title');
    expect(updated.body.content).toBe('Original content');

    const deleted = await request(app).delete(`/notes/${id}`);
    expect(deleted.status).toBe(204);

    const fetchAfterDelete = await request(app).get(`/notes/${id}`);
    expect(fetchAfterDelete.status).toBe(404);
  });
});
