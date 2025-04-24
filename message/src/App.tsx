import { ConfigProvider } from "./Message/ConfigProvider";
import { useMessage } from "./Message/hooks/useMessage";
function BtnExp() {
  const message = useMessage();
  return (
    <button
      onClick={() => {
        message.add({
          content: "请求成功",
        });
      }}>
      发起请求
    </button>
  );
}
function App() {
  return (
    <ConfigProvider>
      <div>
        <BtnExp />
      </div>
    </ConfigProvider>
  );
}

export default App;
