import app from './server';

if (module.hot) {
  module.hot.accept('./server', function() {
    console.log('🔁  HMR Reloading `./server`...');
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT || 3000;

export default app.listen(port, function(err) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`> Started on port ${port}`);
});
