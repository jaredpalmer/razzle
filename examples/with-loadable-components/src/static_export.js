import { renderApp } from './server';

export const render = async (req, res) => {
  const { html } = await renderApp(req, res);

  res.json({ html });
};

export const routes = () => {
  return ['/'];
};
