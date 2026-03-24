"use client"
import { useEffect, useState } from 'react';
import States from './components/States';
import Fetch from './components/Fetch';
import Fetch2 from './components/Fetch2';

export default function Home() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [filter, setFilter] = useState('');
  const [assets, setAssets] = useState([]);

  async function load(p = '') {
    const url = p
      ? `https://fresh-start-16094988886.europe-north1.run.app/assets?platform=${p}`
      : 'https://fresh-start-16094988886.europe-north1.run.app/assets';
    const res = await fetch(url);
    setAssets(await res.json());
  }

  useEffect(() => { load(filter); }, [filter]);

  async function submit(e) {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('platform', platform);
    await fetch('https://fresh-start-16094988886.europe-north1.run.app/upload', {
      method: 'POST',
      body: fd,
    });
    setTitle('');
    setPlatform('');
    setFile(null);
    load(filter);
  }

  async function remove(id) {
    await fetch(`https://fresh-start-16094988886.europe-north1.run.app/assets/${id}`, {
      method: 'DELETE',
    });
    load(filter);
  }

  return (
    <main style={{ padding: 20}}>
      <Fetch2 />
      <form onSubmit={submit}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel" />
        <select value={platform} onChange={e => setPlatform(e.target.value)}>
          <option value="">Platform</option>
          <option>Meta</option>
          <option>Google</option>
          <option>TikTok</option>
        </select>
        <button>Ladda upp</button>
      </form>

      <select value={filter} onChange={e => setFilter(e.target.value)} style={{ margin: '16px 0' }}>
        <option value="">Alla plattformar</option>
        <option>Meta</option>
        <option>Google</option>
        <option>TikTok</option>
      </select>

      {assets.map(a => (
        <div key={a.id} style={{ position: 'relative', marginBottom: 20 }}>
          <button
            onClick={() => remove(a.id)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'red',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
          <p>{a.title} ({a.platform})</p>
          <img src={a.url} width="200" />
        </div>
      ))}
    </main>
  );
}
