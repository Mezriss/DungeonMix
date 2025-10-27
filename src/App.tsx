import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useEffect } from "react";
import { Route, Switch } from "wouter";
import Board from "./Board";
import { detectLocale, dynamicActivate } from "./i18n";
import Landing from "./Landing";

function App() {
  useEffect(() => {
    dynamicActivate(detectLocale());
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/boards/:id">{({ id }) => <Board id={id} />}</Route>
      </Switch>
    </I18nProvider>
  );
}

export default App;
