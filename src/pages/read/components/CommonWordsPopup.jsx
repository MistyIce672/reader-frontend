import { wordService } from "../../../services/word.service";

const CommonWordsPopup = ({
  mostCommonWords,
  setPageContent,
  setShowPopup,
  setError,
  pageContent,
}) => {
  const handleWordAction = async (word, action) => {
    try {
      if (action === "translate") {
        await wordService.addWord({
          originalWord: word.translation,
          translatedWord: word.word,
          originalLanguage: pageContent.originalLanguage,
          translatedLanguage: pageContent.translatedLanguage,
          translate: true,
        });

        // Add word to knownWords array
        const newKnownWord = {
          originalWord: word.translation,
          translatedWord: word.word,
          originalLanguage: pageContent.originalLanguage,
          translatedLanguage: pageContent.translatedLanguage,
          translate: true,
        };

        setPageContent((prevContent) => ({
          ...prevContent,
          knownWords: [...(prevContent.knownWords || []), newKnownWord],
        }));
      } else if (action === "dont-translate") {
        await wordService.addWord({
          originalWord: word.translation,
          translatedWord: word.word,
          originalLanguage: pageContent.originalLanguage,
          translatedLanguage: pageContent.translatedLanguage,
          translate: false,
        });
      }

      // Mark word as handled
      const updatedWords = pageContent.mostCommonWords.map((w) =>
        w.word === word.word ? { ...w, handled: true } : w,
      );
      setPageContent((prevContent) => ({
        ...prevContent,
        mostCommonWords: updatedWords,
      }));

      // Close popup if all words are handled
      if (updatedWords.every((w) => w.handled)) {
        setShowPopup(false);
      }
    } catch (err) {
      setError("Failed to process word");
      console.error(err);
    }
  };

  const handleAllWords = async (action) => {
    try {
      if (action !== "ignore") {
        const unhandledWords = pageContent.mostCommonWords.filter(
          (word) => !word.handled,
        );

        for (const word of unhandledWords) {
          await wordService.addWord({
            originalWord: word.translation,
            translatedWord: word.word,
            originalLanguage: pageContent.originalLanguage,
            translatedLanguage: pageContent.translatedLanguage,
            translate: action === "translate",
          });

          // If translating, add to knownWords
          if (action === "translate") {
            const newKnownWord = {
              originalWord: word.translation,
              translatedWord: word.word,
              originalLanguage: pageContent.originalLanguage,
              translatedLanguage: pageContent.translatedLanguage,
            };

            setPageContent((prevContent) => ({
              ...prevContent,
              knownWords: [...(prevContent.knownWords || []), newKnownWord],
            }));
          }
        }
      }
      setShowPopup(false);
    } catch (err) {
      setError("Failed to process all words");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Common Words on This Page
          </h2>
          <div className="space-y-3 mb-6 sm:mb-8">
            {mostCommonWords
              .filter((word) => !word.handled)
              .map((word, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:border-indigo-200 transition-colors"
                >
                  <div className="text-center sm:text-left">
                    <span className="font-medium text-indigo-600 text-base sm:text-lg">
                      {word.translation}
                    </span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span className="text-gray-700 text-base sm:text-lg">
                      {word.word}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:space-x-3">
                    <button
                      onClick={() => handleWordAction(word, "ignore")}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleWordAction(word, "dont-translate")}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Don't Translate
                    </button>
                    <button
                      onClick={() => handleWordAction(word, "translate")}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Translate
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleAllWords("translate")}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto"
            >
              Translate All
            </button>
            <button
              onClick={() => handleAllWords("dont-translate")}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors w-full sm:w-auto"
            >
              Don't Translate All
            </button>
            <button
              onClick={() => handleAllWords("ignore")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              Ignore All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonWordsPopup;
