import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const CreateInstructionSchema = z.object({
  ceremonyId: z.number().int().positive(),
  target: z.enum(["STUDENT", "PARENT", "GUEST"]),
  title: z.string().min(1),
  content: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

const UpdateInstructionSchema = z.object({
  target: z.enum(["STUDENT", "PARENT", "GUEST"]).optional(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
});

const INSTRUCTION_SELECT = {
  id: true,
  ceremonyId: true,
  target: true,
  title: true,
  content: true,
  order: true,
  createdAt: true,
  updatedAt: true,
} as const;

// POST /api/admin/instructions
export async function createInstruction(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const parsed = CreateInstructionSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id: parsed.data.ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const instruction = await prisma.ceremonyInstruction.create({
    data: parsed.data,
    select: INSTRUCTION_SELECT,
  });

  res.status(201).json({ instruction });
}

// GET /api/admin/ceremonies/:ceremonyId/instructions
export async function getInstructions(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const ceremonyId = Number(req.params.ceremonyId);
  if (!Number.isInteger(ceremonyId) || ceremonyId < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const instructions = await prisma.ceremonyInstruction.findMany({
    where: { ceremonyId },
    select: INSTRUCTION_SELECT,
    orderBy: [{ target: "asc" }, { order: "asc" }],
  });

  res.status(200).json({ instructions });
}

// PATCH /api/admin/instructions/:id
export async function updateInstruction(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid instruction id" });
    return;
  }

  const parsed = UpdateInstructionSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.ceremonyInstruction.findUnique({
    where: { id },
    include: { ceremony: { select: { campusId: true } } },
  });
  if (!existing || existing.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Instruction not found" });
    return;
  }

  const instruction = await prisma.ceremonyInstruction.update({
    where: { id },
    data: parsed.data,
    select: INSTRUCTION_SELECT,
  });

  res.status(200).json({ instruction });
}

// DELETE /api/admin/instructions/:id
export async function deleteInstruction(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid instruction id" });
    return;
  }

  const existing = await prisma.ceremonyInstruction.findUnique({
    where: { id },
    include: { ceremony: { select: { campusId: true } } },
  });
  if (!existing || existing.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Instruction not found" });
    return;
  }

  await prisma.ceremonyInstruction.delete({ where: { id } });
  res.status(200).json({ message: "Instruction deleted" });
}
