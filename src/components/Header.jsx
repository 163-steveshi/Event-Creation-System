import { useIsFetching } from "@tanstack/react-query";

export default function Header({ children }) {
  // useIsFetching: tell the state of the tanstack query is fetching data in the application or not
  //return  value: 0--> not fetching the data, 1 or higher number ---> fetching the data
  const fetching = useIsFetching();
  return (
    <>
      <div id="main-header-loading">{fetching > 0 && <progress />}</div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
