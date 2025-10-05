const ApiKeyForm = ({
  apiKey,
  setApiKey,
  onSave,
}: {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  onSave: () => void;
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button onClick={onSave}>Save</button>
    </div>
  );
};

export default ApiKeyForm;
