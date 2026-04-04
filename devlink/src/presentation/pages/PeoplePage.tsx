import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetUsers } from "@/infrastructure/apis/api-management/profile";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppRoute } from "@/routes";

export const PeoplePage = memo(() => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetUsers(page, search);
  const currentUser = useOwnUser();
  const users = (data?.response?.data ?? []).filter((user: { id: string }) => user.id !== currentUser?.id);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">People</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user: { id: string; name: string; email: string; role: string }) => (
            <Link key={user.id} to={`${AppRoute.Profile}/${user.id}`}>
              <Card className="cursor-pointer transition hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {users.length === 0 && !isLoading && (
        <p className="text-center text-muted-foreground">No people found.</p>
      )}
    </div>
  );
});
