const {
	createEval,
	findAllEvalByFilter,
	findEvalByFilter,
	findEvalAndUpdate,
	deleteEvalByFilter,
} = require("../services/evaluation");
const error = require("../utils/error");
const auth = require("../middleware/auth");

// Create an evaluation
exports.createEvaluation = async (req, res) => {
	const newEvaluation = {
		courseID: req.body.courseID,
		text: req.body.text,
		rating: req.body.rating,
	};
	try {
		await createEval(newEvaluation);
		res.status(200).send("ok");
	} catch (err) {
		return res.status(err.status).send(err);
	}
};

// Retrieve all evaluations

exports.findAllEvaluations = async (req, res) => {
	try {
		const evaluations = await findAllEvalByFilter();
		res.status(200).send(evaluations);
	} catch (err) {
		res.status(err.status).send({ err });
	}
};

exports.findOneEvaluation = async (req, res) => {
	try {
		const evaluation = await findEvalByFilter({
			_id: req.params.evaluationId,
		});
		if (!evaluation) {
			return res
				.status(error.RecordNotFound.status)
				.send(error.RecordNotFound);
		}
		res.send(evaluation);
	} catch (err) {
		return res.status(err.status).send(err);
	}
};

// Update an evaluation identified by the evaluationId in the request
exports.updateEvaluation = async (req, res) => {
	try {
		// Find evaluation and update it with the request body
		await findEvalAndUpdate(
			{ _id: req.params.evaluationId },
			{
				courseID: req.body.courseID,
				text: req.body.text,
				rating: req.body.rating,
			}
		);
	} catch (err) {
		return res.status(err.status).send(err);
	}
	res.status(200).send("ok");
};

// Delete an evaluation with the specified evaluationId in the request
exports.deleteEvaluation = async (req, res) => {
	let eval = await findEvalByFilter({ _id: req.params.evaluationId });
	if (
		!(
			eval &&
			(req.user._id === eval.userId || req.user.role === auth.ADMIN)
		)
	)
		return res.status(error.NotPermitted.status).send(error.NotPermitted);

	try {
		await deleteEvalByFilter({ _id: req.params.evaluationId });
	} catch (err) {
		return res.status(err.status).send(err);
	}
	res.status(200).send("ok");
};
