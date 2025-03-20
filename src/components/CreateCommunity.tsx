export const CreateCommunity = () => {
  return (
    <form>
      <h2>Create New Community</h2>
      <div>
        <label>Community Name</label>
        <input type="text" id="name" required/>
      </div>
      <div>
        <label>Description</label>
        <textarea id="description" required rows={3} />
      </div>
      <button>Create Community</button>
    </form>
  );
};
