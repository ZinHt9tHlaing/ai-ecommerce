import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface ICart {
  quantity: number;
  product: mongoose.Schema.Types.ObjectId;
}

interface IUser {
  name: string;
  email: string;
  password: string;
  owner: boolean;
  profilePhoto: string;
  cartItem: ICart[];
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    owner: {
      type: Boolean,
      default: false,
    },

    profilePhoto: {
      type: String,
    },

    cartItem: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
}; // return boolean

export const User = mongoose.model<IUser>("User", userSchema);
