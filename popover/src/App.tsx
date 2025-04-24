import Popover from "./Popover";

export default function App() {
  const popoverContent = (
    <div>
      测试测试
      <button
        onClick={() => {
          alert(1);
        }}>
        触发了！
      </button>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      placement="bottom"
      trigger="click"
      style={{ margin: "200px" }}>
      <button>show me code</button>
    </Popover>
  );
}
