import { ApiResponse } from "../lib/ApiResponse";
import { asyncHandler } from "../lib/asyncHandler";
import prisma from "../lib/prisma";

export const getUser = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User Details Fetches"));
  } catch (error) {
    console.log(error);
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

//set meta data for the user
export const setMetaData = asyncHandler(async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatarId: req.body.avatarId,
      },
    });

    if (!user) {
      throw new ApiResponse(401, null, "Meta data not updated");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Meta data updated"));
  } catch (error) {
    console.log(error);
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

//get avatars
export const getAvatars = asyncHandler(async (rep, res) => {
    console.log("hello")
  try {
    const avatars = await prisma.avatar.findMany();
    if (!avatars) {
      throw new ApiResponse(401, null, "No avatars found");
    }
    res.status(200).json(new ApiResponse(200, avatars, "Avatars found"));
  } catch (error: any) {
    console.log(error);
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

//bulk meta data
export const getBulkMetaData = asyncHandler(async (req, res) => {
  try {
    const ids = req.query.ids.slice(1, -1).split(",");
    if (ids.length === 0) {
      throw new ApiResponse(
        401,
        null,
        "No avatars to show \n PLease send valid user data"
      );
    }
    const avatars = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        avatar: {
          select: {
            imageUrl: true,
          },
        },
      },
    });
    if (!avatars) {
      throw new ApiResponse(404, null, "No avatars found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, avatars, "Avatar bulk metaData"));
  } catch (error: any) {
    console.log(error);
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});
