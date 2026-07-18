import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const UpdateRequestStatusSchema = z.object({
  requestStatus: z.enum(["IN_PROGRESS", "COMPLETED"]),
});

// GET /api/vendor/requests
export async function getMyRequests(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;

  const requests = await prisma.vendorRequest.findMany({
    where: { vendorId },
    select: {
      id: true,
      requestTitle: true,
      requestDescription: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      ceremony: {
        select: { id: true, title: true, ceremonyDate: true, venue: true },
      },
      serviceOffering: {
        select: { id: true, title: true, price: true },
      },
      assignedBy: {
        select: { id: true, fullName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ requests });
}

// GET /api/vendor/requests/:id
export async function getMyRequestById(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;
  const requestId = Number(req.params.id);
  if (!Number.isInteger(requestId) || requestId < 1) {
    res.status(400).json({ message: "Invalid request id" });
    return;
  }

  const request = await prisma.vendorRequest.findUnique({
    where: { id: requestId, vendorId },
    select: {
      id: true,
      requestTitle: true,
      requestDescription: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      ceremony: {
        select: {
          id: true,
          title: true,
          ceremonyDate: true,
          venue: true,
          status: true,
        },
      },
      serviceOffering: {
        select: { id: true, title: true, description: true, price: true },
      },
      assignedBy: {
        select: { id: true, fullName: true, email: true },
      },
    },
  });

  if (!request) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  res.status(200).json({ request });
}

// PATCH /api/vendor/requests/:id
export async function updateRequestStatus(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;
  const requestId = Number(req.params.id);
  if (!Number.isInteger(requestId) || requestId < 1) {
    res.status(400).json({ message: "Invalid request id" });
    return;
  }

  const parsed = UpdateRequestStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.vendorRequest.findUnique({
    where: { id: requestId, vendorId },
  });
  if (!existing) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  if (existing.requestStatus === "COMPLETED") {
    res.status(409).json({ message: "Request is already completed" });
    return;
  }
  if (existing.requestStatus === "CANCELLED") {
    res.status(409).json({ message: "Request has been cancelled" });
    return;
  }

  const request = await prisma.vendorRequest.update({
    where: { id: requestId },
    data: { requestStatus: parsed.data.requestStatus },
    select: {
      id: true,
      requestTitle: true,
      requestStatus: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ request });
}
