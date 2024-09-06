import React from "react";

const Models = ({ models, searchQuery }) => {
  // Filter models based on the search query
  const filteredModels = models.filter((model) =>
    model.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort models to prioritize those with 'greesyai/' prefix
  const sortedModels = filteredModels.sort((a, b) => {
    const isAGreesyai = a.id.startsWith("greesyai/");
    const isBGreesyai = b.id.startsWith("greesyai/");

    if (isAGreesyai && !isBGreesyai) return -1;
    if (!isAGreesyai && isBGreesyai) return 1;
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedModels.length > 0 ? (
        sortedModels.map((model) => {
          // Replace 'chat.completions' with 'official' in the model ID
          const updatedId = model.id.replace("chat.completions", "official");
          const updatedPrefix = updatedId.split("/")[0];

          return (
            <div
              key={model.id}
              className="bg-black border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-white">
                  {updatedId}
                </h2>
                <span className="bg-gray-900 text-xs px-2 py-0.5 rounded-full text-white">
                  {model.object || "Unknown Object"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                {model.image ? (
                  <img
                    src={model.image}
                    alt={updatedId}
                    className="w-8 h-8 mr-2 rounded-lg"
                  />
                ) : (
                  <div className="w-8 h-8 mr-2 rounded-lg bg-gray-700"></div>
                )}
                <span className="text-sm text-gray-400">{updatedPrefix}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                {model.description || "No description available."}
              </p>
              <p className="text-xs text-gray-400">
                Provider: {model.provider || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">
                Created:{" "}
                {model.created
                  ? new Date(model.created * 1000).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-400 col-span-full">
          No models match your search.
        </p>
      )}
    </div>
  );
};

export default Models;
