import TicketCard from "@components/tickets/Card";
import Search from "@components/ui/form/Search";
import Select from "@components/ui/form/Select";
import useUserInfo from "@hooks/useUserInfo";
import useFilters from "@hooks/useFilters";
import { useQuery } from "@tanstack/react-query";
import {
  FetchTicketsResponse,
  fetchUserTickets,
} from "@services/ticketServices";
import { AxiosError } from "axios";
import Loading from "@components/ui/Loading";
import FetchError from "@components/ui/FetchError";
import NotFoundResource from "@components/ui/NotFound";

/**
 * @description Página de Chamados por Chat do Cliente.
 *
 * Essa página exibe uma lista de chamados relacionados ao atendimento por chat.
 * O usuário pode filtrar os chamados por status e pesquisar por palavras-chave.
 *
 * @component
 * @returns {JSX.Element} O componente da página renderizado.
 */

export default function UserEmailTicketsPage() {
  // Hook para obter informações do usuário
  const user = useUserInfo();
  // Converte o ID do usuário para um número
  const userID = Number(user?.id);
  // Hook para gerenciar filtros de pesquisa e status
  const { search, status, handleSearch, handleStatus } = useFilters();
  // Hook para buscar os chamados do usuário (por email)
  const { data, isPending, error, refetch } = useQuery<
    FetchTicketsResponse,
    AxiosError<FetchTicketsResponse>
  >({
    queryKey: ["user-tickets", { id: userID, search: search, status: status }],
    queryFn: () => fetchUserTickets(userID, "email", search, status),
    enabled: !!userID,
  });

  return (
    <div className="w-full bg-base-200 dark:bg-base-100 flex justify-center min-h-[calc(100vh-5.0625rem)]">
      <div className="w-full max-w-screen-xl mb-8 px-4">
        <h1 className="my-6">Meus Chamados por E-mail</h1>
        <div className="flex flex-col xs:flex-row gap-4 justify-between bg-base-20 mb-6">
          <Search
            placeholder="Pesquisar chamados"
            onChange={handleSearch}
            className="dark:bg-base-200 w-full xs:max-w-2xs"
          />
          <Select
            defaultValue=""
            onChange={handleStatus}
            className="w-full xs:max-w-2xs"
          >
            <option value="" defaultChecked disabled>
              Selecione o status
            </option>
            <option value="">Todos</option>
            <option value="aberto">Aberto</option>
            <option value="em andamento">Em Andamento</option>
            <option value="pendente">Pendente</option>
            <option value="resolvido">Resolvido</option>
            <option value="fechado">Fechado</option>
            <option value="cancelado">Cancelado</option>
          </Select>
        </div>
        <div className="flex flex-col gap-8">
          {/* Exibe um carregador enquanto os dados estão sendo buscados */}
          {isPending && <Loading className="h-60" />}
          {/* Exibe um erro se a busca falhar */}
          {error && (
            <FetchError
              title="Erro as exibir os chamados"
              message={error.response?.data?.message || error.message}
              action={refetch}
            />
          )}
          {/* Exibe uma mensagem de não encontrado se não houver dados */}
          {!isPending && !data?.chamados?.length && (
            <NotFoundResource message="Nenhum chamado encontrado" />
          )}
          {/* Renderiza os cartões de chamados */}
          {data?.chamados &&
            data.chamados.map((ticket) => (
              <TicketCard key={ticket.id} data={ticket} />
            ))}
        </div>
      </div>
    </div>
  );
}
