import { useEffect, useMemo, useState } from "react";
import { PeopleAlt, Search, Timeline } from "@mui/icons-material";
import { Alert, Box, Card, CardContent, Chip, Container, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { getAdminUsers, type AdminUser } from "@/lib/studioApi";

const AdminUsersLive = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getAdminUsers()
      .then(setUsers)
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load users."))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => users.filter((user) => `${user.full_name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase())),
    [users, query],
  );
  const active = users.filter((user) => user.last_active_at && new Date(user.last_active_at).getTime() > Date.now() - 30 * 86400000).length;
  const pageViews = users.reduce((sum, user) => sum + Number(user.page_views_30_days || 0), 0);

  return <Box sx={{ minHeight: "100%", bgcolor: "#f7f5f0", py: 3 }}><Container maxWidth="xl"><Stack spacing={3}>
    <Box><Chip icon={<PeopleAlt />} label="LIVE STUDIO DATA" color="success" variant="outlined" /><Typography variant="h3" sx={{ mt: 1, fontFamily: "Georgia, serif", fontWeight: 700 }}>Members & activity</Typography><Typography color="text.secondary">Aggregate engagement only: account creation, last activity, visits and page views.</Typography></Box>
    {error && <Alert severity="error">{error}</Alert>}{loading && <LinearProgress />}
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}><Card sx={{ flex: 1, borderRadius: 3 }}><CardContent><Typography color="text.secondary">Total accounts</Typography><Typography variant="h4">{users.length}</Typography></CardContent></Card><Card sx={{ flex: 1, borderRadius: 3 }}><CardContent><Typography color="text.secondary">Active in 30 days</Typography><Typography variant="h4">{active}</Typography></CardContent></Card><Card sx={{ flex: 1, borderRadius: 3 }}><CardContent><Typography color="text.secondary">Total page views</Typography><Typography variant="h4">{pageViews}</Typography></CardContent></Card></Stack>
    <TextField fullWidth label="Search member, email or role" value={query} onChange={(event) => setQuery(event.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} /> }} />
    <Card sx={{ borderRadius: 3 }}><CardContent><Stack spacing={1.5}>{visible.map((user) => <Box key={user.id} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" }, gap: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}><Box><Typography fontWeight={700}>{user.full_name || "Unnamed member"}</Typography><Typography variant="body2" color="text.secondary">{user.email}</Typography></Box><Chip size="small" label={user.role} color={user.role === "admin" ? "warning" : user.role === "trainer" ? "success" : "primary"} sx={{ width: "fit-content", textTransform: "capitalize" }} /><Typography variant="body2"><Timeline fontSize="inherit" /> {user.visits_30_days} visits · {user.page_views_30_days} views</Typography><Typography variant="body2" color="text.secondary">{user.last_active_at ? `Last active ${new Date(user.last_active_at).toLocaleString()}` : "No activity recorded yet"}</Typography></Box>)}{!loading && visible.length === 0 && <Typography color="text.secondary" textAlign="center" py={4}>No matching accounts.</Typography>}</Stack></CardContent></Card>
  </Stack></Container></Box>;
};

export default AdminUsersLive;
