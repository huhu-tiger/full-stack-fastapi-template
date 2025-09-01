import {
  Container,
  EmptyState,
  Flex,
  Heading,
  Table,
  VStack,
  Badge,
  Text,
  HStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"
import { z } from "zod"

import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"
import { AppWareActionsMenu } from "../components/Common/AppWareActionsMenu"
import AddAppWare from "../components/Appware/AddAppware"
import { AppWaresService } from "../services/appwares"

export const appwaresSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 5

function getAppWaresQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      AppWaresService.readAppWares({ 
        skip: (page - 1) * PER_PAGE, 
        limit: PER_PAGE 
      }),
    queryKey: ["appwares", { page }],
  }
}

interface AppWaresTableProps {
  routeFullPath: string
  page: number
}

function AppWaresTable({ routeFullPath, page }: AppWaresTableProps) {
  const navigate = useNavigate({ from: routeFullPath })

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getAppWaresQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const appwares = data?.data.slice(0, PER_PAGE) ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return (
      <VStack>
        <Text>加载中...</Text>
      </VStack>
    )
  }

  if (appwares.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>您还没有任何应用仓库</EmptyState.Title>
            <EmptyState.Description>
              添加一个新的应用仓库开始使用
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge colorPalette="green">启用</Badge>
    ) : (
      <Badge colorPalette="red">禁用</Badge>
    )
  }

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge colorPalette="blue">激活</Badge>
    ) : (
      <Badge colorPalette="gray">未激活</Badge>
    )
  }

  return (
    <>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>名称</Table.ColumnHeader>
            <Table.ColumnHeader>备注</Table.ColumnHeader>
            <Table.ColumnHeader>状态</Table.ColumnHeader>
            <Table.ColumnHeader>激活状态</Table.ColumnHeader>
            <Table.ColumnHeader>浏览量</Table.ColumnHeader>
            <Table.ColumnHeader>排序</Table.ColumnHeader>
            <Table.ColumnHeader>创建时间</Table.ColumnHeader>
            <Table.ColumnHeader>操作</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {appwares?.map((appware) => (
            <Table.Row key={appware.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell>{appware.id}</Table.Cell>
              <Table.Cell truncate maxW="sm">
                {appware.name}
              </Table.Cell>
              <Table.Cell
                color={!appware.remark ? "gray" : "inherit"}
                truncate
                maxW="30%"
              >
                {appware.remark || "无备注"}
              </Table.Cell>
              <Table.Cell>
                {getStatusBadge(appware.status)}
              </Table.Cell>
              <Table.Cell>
                {getActiveBadge(appware.is_active)}
              </Table.Cell>
              <Table.Cell>{appware.view_count}</Table.Cell>
              <Table.Cell>{appware.sort_order}</Table.Cell>
              <Table.Cell>
                {new Date(appware.created_at).toLocaleDateString("zh-CN")}
              </Table.Cell>
              <Table.Cell>
                <AppWareActionsMenu appware={appware} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count}
          pageSize={PER_PAGE}
          onPageChange={({ page }) => setPage(page)}
        >
          <Flex>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  )
}

export function AppWaresPage({ routeFullPath, page }: AppWaresTableProps) {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        应用仓库管理
      </Heading>
      <AddAppWare />
      <AppWaresTable routeFullPath={routeFullPath} page={page} />
    </Container>
  )
}