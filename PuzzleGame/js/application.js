// Wait till the browser is ready to render the game (avoids glitches)
function application (editor)
{
  window.requestAnimationFrame(function () {
  new GameManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, editor);


  // TODO: This code is in need of a refactor (along with the rest)
  var storage     = new LocalStorageManager;
});
}