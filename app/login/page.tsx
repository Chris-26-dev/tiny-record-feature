"use client";

import { useForm } from "react-hook-form";
import { TextField, Button, Stack, Paper, Typography } from "@mui/material";

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) {
      window.location.href = "/records";
    } else {
      alert(json.error);
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", bgcolor: "background.default" }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 360,
          bgcolor: "white",
          borderRadius: 3,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Typography variant="h5" align="center" fontWeight="bold">
              Login
            </Typography>

            <TextField
              label="Email"
              {...register("email")}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Password"
              type="password"
              {...register("password")}
              fullWidth
              variant="outlined"
            />

            <Button type="submit" variant="contained" size="large" fullWidth>
              Sign In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
