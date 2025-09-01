import {
  Container,
  EmptyState,
  Heading,
  Table,
  VStack,
  Badge,
  Text,
  Box,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { FiTrendingUp } from "react-icons/fi"

import { AppWareActionsMenu } from "../components/Common/AppWareActionsMenu"
import { AppWaresService } from "../services/appwares"

function getPopularAppWaresQueryOptions() {
  return {
    queryFn: () => AppWaresService.readPopularAppWares({ limit: 20 }),
    queryKey: ["popular-appwares"],
  }
}

function PopularAppWaresTable() {
  const { data: appwares, isLoading } = useQuery({
    ...getPopularAppWaresQueryOptions(),
  })

  if (isLoading) {
    return (
      <VStack>
        <Text>加载中...</Text>
      </VStack>
    )
  }

  if (!appwares || appwares.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiTrendingUp />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>暂无热门应用仓库</EmptyState.Title>
            <EmptyState.Description>
              还没有应用仓库被浏览，快去创建第一个吧！
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

  const getPopularityBadge = (viewCount: number, index: number) => {
    if (index === 0) {
      return <Badge colorPalette="yellow">🥇 最热门</Badge>
    } else if (index === 1) {
      return <Badge colorPalette="gray">🥈 第二名</Badge>
    } else if (index === 2) {
      return <Badge colorPalette="orange">🥉 第三名</Badge>
    } else if (index < 10) {
      return <Badge colorPalette="purple">🔥 热门</Badge>
    }
    return null
  }

  return (
    <Box>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>排名</Table.ColumnHeader>
            <Table.ColumnHeader>名称</Table.ColumnHeader>
            <Table.ColumnHeader>备注</Table.ColumnHeader>
            <Table.ColumnHeader>状态</Table.ColumnHeader>
            <Table.ColumnHeader>激活状态</Table.ColumnHeader>
            <Table.ColumnHeader>浏览量</Table.ColumnHeader>
            <Table.ColumnHeader>热度标识</Table.ColumnHeader>
            <Table.ColumnHeader>创建时间</Table.ColumnHeader>
            <Table.ColumnHeader>操作</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {appwares?.map((appware, index) => (
            <Table.Row key={appware.id}>
              <Table.Cell>
                <Text fontWeight="bold" fontSize="lg">
                  #{index + 1}
                </Text>
              </Table.Cell>
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
              <Table.Cell>
                <Text fontWeight="bold" color="blue.500">
                  {appware.view_count}
                </Text>
              </Table.Cell>
              <Table.Cell>
                {getPopularityBadge(appware.view_count, index)}
              </Table.Cell>
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
    </Box>
  )
}

export function PopularAppWaresPage() {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        热门应用仓库
      </Heading>
      <Text color="gray.600" mt={2} mb={6}>
        按浏览量排序的最受欢迎的应用仓库
      </Text>
      <PopularAppWaresTable />
    </Container>
  )
}