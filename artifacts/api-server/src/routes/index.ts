import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import notesRouter from "./notes.js";
import flashcardsRouter from "./flashcards.js";
import quizzesRouter from "./quizzes.js";
import chatRouter from "./chat.js";
import studyplansRouter from "./studyplans.js";
import progressRouter from "./progress.js";
import aiRouter from "./ai.js";
import doubtRouter from "./doubt.js";
import lectureRouter from "./lecture.js";
import examRouter from "./exampredictor.js";
import codingRouter from "./coding.js";
import roadmapRouter from "./roadmap.js";
import pdfRouter from "./pdfmode.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(notesRouter);
router.use(flashcardsRouter);
router.use(quizzesRouter);
router.use(chatRouter);
router.use(studyplansRouter);
router.use(progressRouter);
router.use(aiRouter);
router.use(doubtRouter);
router.use(lectureRouter);
router.use(examRouter);
router.use(codingRouter);
router.use(roadmapRouter);
router.use(pdfRouter);

export default router;
