import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { lazy, useEffect } from "react";
import { Route, Switch } from "wouter";
import { detectLocale, dynamicActivate } from "./i18n";

const Landing = lazy(() => import("./Landing"));
const Board = lazy(() => import("./Board"));

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
