import Pusher from 'pusher-js';

function App() {
  const pusher = new Pusher('14396d60e466962a3fbd', {
    cluster: 'eu',
  });
  const channel = pusher.subscribe('notifications');
  channel.bind('event.created', function (data) {
    console.log(data);
  });
  return (
    <div>
      <p>hello</p>
    </div>
  );
}
export default App;
