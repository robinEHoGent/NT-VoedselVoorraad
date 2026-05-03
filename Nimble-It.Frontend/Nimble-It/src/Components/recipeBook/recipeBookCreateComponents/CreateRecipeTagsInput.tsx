import { FieldArray, ErrorMessage } from "formik";
import { useQuery } from "@tanstack/react-query";
import { GetAllTags } from "@/Api/apiCallsTags";
import Loading from "@/UI/Loading";
import { useState } from "react";
import { createPortal } from "react-dom";
import CreateTagPopup from "@/Components/pop-ups/CreateTagPopup";

function CreateRecipeTagsInput({ tags }: CreateRecipeTagsInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { isPending, data: availableTags } = useQuery<TagsContract[]>({
    queryKey: ["tags"],
    queryFn: GetAllTags,
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) {
    return <Loading />;
  }

  const filteredTags = availableTags
    ?.filter(
      (tag) =>
        !tags.includes(tag.id) &&
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .slice(0, 5);

  return (
    <div className="col-span-full">
      <FieldArray name="tags">
        {({ push, remove }) => (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map((tagId, index) => {
                const selectedTag = availableTags?.find((t) => t.id === tagId);
                return (
                  <div
                    key={index}
                    className="border-primary bg-primary/10 text-primary flex items-center gap-2 rounded-full border-2 px-4 py-2"
                  >
                    <span>{selectedTag?.name || "Unknown"}</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="hover:text-primary/70 text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="relative flex justify-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Add a tag..."
                className="border-customGrayLight bg-customWhite w-64 rounded-full border-2 px-4 py-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-primary hover:bg-primary/90 text-customWhite flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold shadow-lg transition-colors"
                title="Create new tag"
              >
                +
              </button>
              {showSuggestions &&
                searchTerm &&
                filteredTags &&
                filteredTags.length > 0 && (
                  <div className="bg-customWhite border-customGrayLight absolute top-12 z-10 w-64 rounded-lg border-2 shadow-lg">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          push(tag.id);
                          setSearchTerm("");
                        }}
                        className="hover:bg-primary/10 w-full px-4 py-2 text-left transition-colors"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </FieldArray>
      <ErrorMessage
        name="tags"
        component="div"
        className="text-primary mt-1 text-center text-sm"
      />

      {/* Modal for creating new tag */}
      {showModal &&
        createPortal(
          <div className="bg-bg border-secondary fixed top-1/2 left-1/2 z-50 flex min-w-4/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl border-2 px-4 py-2 text-center shadow-md md:min-w-1/2">
            <CreateTagPopup onClose={() => setShowModal(false)} />
          </div>,
          document.body,
        )}
    </div>
  );
}

interface CreateRecipeTagsInputProps {
  tags: number[];
}

export default CreateRecipeTagsInput;
