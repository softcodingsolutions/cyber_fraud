import Home from "../Home/Home";
import WinnerList from "../Winner List/WinnerList";

export default function Content({ selectedPage }) {
  const renderContent = () => {
    switch (selectedPage) {
      case "home":
        return <Home />;
      case "winners":
        return <WinnerList />;
      default:
        return <Home />;
    }
  };

  return <>{renderContent()}</>;
}
