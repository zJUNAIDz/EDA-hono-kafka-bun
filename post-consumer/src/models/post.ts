import mongoose from "mongoose";

interface Post {
  title: string;
  content: string;
};

const schema = new mongoose.Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

export default mongoose.model("PostModel", schema);