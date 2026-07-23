const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    console.error('VALIDATION ERROR:', JSON.stringify(result.error.flatten().fieldErrors, null, 2));
    console.error('BODY RECEIVED:', JSON.stringify(req.body, null, 2));
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  req.body = result.data;
  next();
};

export default validate;
