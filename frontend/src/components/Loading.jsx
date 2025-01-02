import loadingImg from "../assets/images/loading.svg";

const Loading = () => {
  return (
    <div className="w-screen h-screen  flex items-center justify-center">
      <img className="text-slate-900" src={loadingImg} alt="loading..." />
    </div>
  );
};
export default Loading;
