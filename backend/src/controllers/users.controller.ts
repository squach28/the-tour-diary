import express from "express";

export const getUserById = (req: express.Request, res: express.Response) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const updateUserById = (req: express.Request, res: express.Response) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const deleteUserById = (req: express.Request, res: express.Response) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
