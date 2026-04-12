import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUsers } from "@/infrastructure/apis/api-management/profile";
import { 
  useGetMyConnections, 
  useGetPendingRequests, 
  useSendConnectionRequest, 
  useAcceptConnection, 
  useRejectConnection, 
  useRemoveConnection,
  useGetConnectionStatus
} from "@/infrastructure/apis/api-management/connections";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppRoute } from "@/routes";

const DiscoverCard = ({ user }: { user: any }) => {
  const { data: statusData, isLoading: connectionLoading } = useGetConnectionStatus(user.id);
  const sendRequest = useSendConnectionRequest();
  
  const status = statusData?.response;

  return (
    <Card className="border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex h-full flex-col justify-between space-y-4 p-4">
        <Link to={`${AppRoute.Profile}/${user.id}`}>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium hover:underline">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Role: {user.role}</p>
            </div>
          </div>
        </Link>
        
        <div>
          {connectionLoading ? (
            <Button disabled variant="outline" className="w-full">Loading...</Button>
          ) : status?.status === "Pending" ? (
            <Button disabled variant="secondary" className="w-full">Request Sent / Pending</Button>
          ) : status?.status === "Accepted" ? (
            <Button disabled variant="outline" className="w-full text-green-600 border-green-600">Connected</Button>
          ) : (
             <Button 
               className="w-full" 
               onClick={() => sendRequest.mutate(user.id)}
               disabled={sendRequest.isPending}
             >
               {sendRequest.isPending ? "Sending..." : "Connect"}
             </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ConnectionCard = ({ connection }: { connection: any }) => {
  const currentUser = useOwnUser();
  const removeConnection = useRemoveConnection();
  
  const isRequester = connection.requesterId === currentUser?.id;
  const otherUser = isRequester ? connection.receiver : connection.requester;
  
  if (!otherUser) return null;

  return (
    <Card className="border-border/70 transition-all hover:shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <Link to={`${AppRoute.Profile}/${otherUser.id}`}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {otherUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium hover:underline">{otherUser.name}</p>
              <p className="text-sm text-muted-foreground">{otherUser.email}</p>
            </div>
          </div>
        </Link>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => {
            if (window.confirm("Remove this connection?")) {
              removeConnection.mutate(connection.id);
            }
          }}
          disabled={removeConnection.isPending}
        >
          Remove
        </Button>
      </CardContent>
    </Card>
  );
};

const PendingRequestCard = ({ request }: { request: any }) => {
  const acceptRequest = useAcceptConnection();
  const rejectRequest = useRejectConnection();
  const queryClient = useQueryClient();

  const requester = request.requester;
  if (!requester) return null;

  return (
    <Card className="border-border/70 transition-all hover:shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <Link to={`${AppRoute.Profile}/${requester.id}`}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {requester.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium hover:underline">{requester.name}</p>
              <p className="text-sm text-muted-foreground">{requester.email}</p>
            </div>
          </div>
        </Link>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm"
            onClick={() => acceptRequest.mutate(request.id, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
                queryClient.invalidateQueries({ queryKey: ["myConnections"] });
              }
            })}
            disabled={acceptRequest.isPending || rejectRequest.isPending}
          >
            Accept
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => rejectRequest.mutate(request.id, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
              }
            })}
            disabled={acceptRequest.isPending || rejectRequest.isPending}
          >
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const PeoplePage = memo(() => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const { data: usersData, isLoading: usersLoading } = useGetUsers(page, search);
  const { data: connectionsData, isLoading: connectionsLoading } = useGetMyConnections();
  const { data: pendingData, isLoading: pendingLoading } = useGetPendingRequests();
  
  const currentUser = useOwnUser();
  const usersPage = usersData?.response;
  const users = (usersPage?.data ?? []).filter((user: { id: string }) => user.id !== currentUser?.id);
  const usersPageSize = usersPage?.pageSize ?? 20;
  const usersTotalCount = usersPage?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(usersTotalCount / usersPageSize));
  const connections = connectionsData?.response ?? [];
  const pendingRequests = pendingData?.response ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Card className="border-border/70 bg-card/80">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl tracking-tight">Network</CardTitle>
          <CardDescription>Discover developers, manage your connections, and respond to requests.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList className="grid h-auto w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="connections">My Connections ({connections.length})</TabsTrigger>
          <TabsTrigger value="requests">Requests ({pendingRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <Input
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>

          {usersLoading ? (
            <p className="text-muted-foreground">Loading people...</p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((user: any) => (
                  <DiscoverCard key={user.id} user={user} />
                ))}
              </div>
              {users.length === 0 && <p className="text-muted-foreground">No people found.</p>}
              {users.length > 0 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">Page {page} / {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          {connectionsLoading ? (
            <p className="text-muted-foreground">Loading connections...</p>
          ) : connections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {connections.map((conn: any) => (
                <ConnectionCard key={conn.id} connection={conn} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You don't have any connections yet.</p>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {pendingLoading ? (
            <p className="text-muted-foreground">Loading requests...</p>
          ) : pendingRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingRequests.map((req: any) => (
                <PendingRequestCard key={req.id} request={req} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pending requests.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});
