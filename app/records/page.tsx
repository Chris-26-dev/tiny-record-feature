"use client";

import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TextField, Button, Stack, MenuItem, CircularProgress, Typography, Paper } from "@mui/material";

type Record = {
    id: number;
    title: string;
    priority: "low" | "med" | "high";
    user_email: string;
    created_at: string;
};

type RecordForm = { title: string; priority: "low" | "med" | "high" };

export default function RecordsPage() {
    const queryClient = useQueryClient();

    const { data: records, isLoading } = useQuery<Record[]>({
        queryKey: ["records"],
        queryFn: async () => {
            const res = await fetch("/api/records");
            if (!res.ok) throw new Error("Unauthorized");
            return res.json();
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<RecordForm>({
        mode: "onChange", // validate as user types
    });

    const mutation = useMutation({
        mutationFn: async (data: RecordForm) => {
            const res = await fetch("/api/records", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to save");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["records"] });
            reset();
        },
    });

    const onSubmit = (data: RecordForm) => {
        mutation.mutate(data);
    };

    const handleLogout = async () => {
        const res = await fetch("/api/logout", { method: "POST" });
        window.location.href = "http://localhost:3001/login";
    };

    return (
        <Paper
            elevation={3}
            sx={{ p: 3, maxWidth: 700, mx: "auto", bgcolor: "background.default" }}
        >
            <Stack spacing={4}>
                {/* Header */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h5" fontWeight="bold">
                        Records
                    </Typography>
                    <Button variant="outlined" color="error" onClick={handleLogout}>
                        Logout
                    </Button>
                </Stack>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Title"
                            {...register("title", {
                                required: "Title is required",
                                minLength: {
                                    value: 3,
                                    message: "Title must be at least 3 characters",
                                },
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            sx={{
                                bgcolor: "white",
                                borderRadius: 1,
                            }}
                        />
                        <TextField
                            select
                            label="Priority"
                            defaultValue="low"
                            {...register("priority")}
                            sx={{
                                bgcolor: "white",
                                borderRadius: 1,
                            }}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="med">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </TextField>
                        <Button type="submit" variant="contained" disabled={!isValid}>
                            Add
                        </Button>
                    </Stack>
                </form>

                {/* Records list */}
                {isLoading ? (
                    <Stack alignItems="center">
                        <CircularProgress />
                        <Typography>Loading records...</Typography>
                    </Stack>
                ) : (
                    <Stack spacing={2}>
                        {records?.map((r) => (
                            <Paper
                                key={r.id}
                                sx={{ p: 2, bgcolor: "grey.900", color: "white" }}
                            >
                                <Typography fontWeight="bold">{r.title}</Typography>
                                <Typography variant="body2" color="grey.400">
                                    Priority: {r.priority}
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(r.created_at).toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="grey.500">
                                    by {r.user_email}
                                </Typography>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}
