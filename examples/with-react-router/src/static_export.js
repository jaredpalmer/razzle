import { renderApp } from './server';

export const render = (req, res) => {
  const { html } = renderApp(req, res);

  res.json({ html });
};

export const routes = () => {
  return ['/', '/about'];
};
