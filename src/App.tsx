import { Switch, Route } from "wouter";
import Landing from "./Landing";
import Board from "./Board";

function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/boards/:id">{({ id }) => <Board id={id} />}</Route>
    </Switch>
  );
}

export default App;
