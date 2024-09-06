import { useRouter } from "next/navigation";
export default function Blog({ data }) {
  //const dateString = '2020-05-14T04:00:00Z'

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const router = useRouter();
  return (
    <>
      <div
        className={`${data.background || " bg-gradient-to-br from-cyan-200 to-blue-200"} rounded-3xl p-6 mb-6`}
        onClick={() => router.push(`/blog/${data.id}`)}
      >
        <div className="text-gray-200 text-sm mb-2">
          {data.category || "Research"} • {formatDate(Date.now())}
        </div>
        <div className="text-white text-2xl font-bold mb-4 font-sans">
          {data.title}
        </div>

        <div className="text-white font-sans text-lg break-all">
          {data.content.split(0, 10)}
        </div>
      </div>

      {/* <div className="bg-gradient-to-br from-blue-500 to-orange-500 rounded-3xl p-6">
        <div className="text-sm mb-2">Research • Aug 04, 2024</div>
        <div className="text-2xl font-bold mb-4">Greesy Guard 2</div>
        <div className="text-lg">Nextgen Content moderation model.</div>
      </div>*/}
    </>
  );
}
