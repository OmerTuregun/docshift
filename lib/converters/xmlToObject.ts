function parseTagBlock(
  xml: string,
): { tag: string; content: string; selfClosing: boolean } | null {
  const trimmed = xml.trim();
  const selfClosing = trimmed.match(/^<([\w-]+)(?:\s[^>]*)?\/>$/);

  if (selfClosing) {
    return { tag: selfClosing[1], content: "", selfClosing: true };
  }

  const paired = trimmed.match(/^<([\w-]+)(?:\s[^>]*)?>([\s\S]*)<\/\1>$/);

  if (!paired) {
    return null;
  }

  return {
    tag: paired[1],
    content: paired[2].trim(),
    selfClosing: false,
  };
}

function splitChildTags(content: string): string[] {
  const children: string[] = [];
  let index = 0;

  while (index < content.length) {
    const nextTag = content.indexOf("<", index);

    if (nextTag === -1) {
      break;
    }

    const selfClosingEnd = content.indexOf("/>", nextTag);

    if (selfClosingEnd !== -1) {
      const nextOpen = content.indexOf("<", nextTag + 1);
      const isSelfClosing =
        nextOpen === -1 || selfClosingEnd < nextOpen;

      if (isSelfClosing) {
        children.push(content.slice(nextTag, selfClosingEnd + 2));
        index = selfClosingEnd + 2;
        continue;
      }
    }

    const openMatch = content.slice(nextTag).match(/^<([\w-]+)(?:\s[^>]*)?>/);

    if (!openMatch) {
      index = nextTag + 1;
      continue;
    }

    const tagName = openMatch[1];
    const closeTag = `</${tagName}>`;
    let depth = 0;
    let cursor = nextTag;

    while (cursor < content.length) {
      const openPos = content.indexOf(`<${tagName}`, cursor);

      if (openPos === cursor) {
        depth += 1;
        cursor = openPos + 1;
        continue;
      }

      const closePos = content.indexOf(closeTag, cursor);

      if (closePos === -1) {
        break;
      }

      depth -= 1;
      cursor = closePos + closeTag.length;

      if (depth === 0) {
        children.push(content.slice(nextTag, cursor));
        index = cursor;
        break;
      }
    }

    if (depth !== 0) {
      index = nextTag + 1;
    }
  }

  return children;
}

function assignValue(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  if (key in target) {
    const existing = target[key];

    if (Array.isArray(existing)) {
      existing.push(value);
      return;
    }

    target[key] = [existing, value];
    return;
  }

  target[key] = value;
}

function parseNode(xml: string): unknown {
  const block = parseTagBlock(xml);

  if (!block) {
    return xml.trim();
  }

  if (block.selfClosing) {
    return { [block.tag]: null };
  }

  if (!block.content.includes("<")) {
    return { [block.tag]: block.content };
  }

  const children = splitChildTags(block.content);

  if (children.length === 0) {
    return { [block.tag]: block.content };
  }

  const childObject: Record<string, unknown> = {};

  for (const child of children) {
    const parsedChild = parseNode(child);

    if (
      parsedChild !== null &&
      typeof parsedChild === "object" &&
      !Array.isArray(parsedChild)
    ) {
      for (const [key, value] of Object.entries(
        parsedChild as Record<string, unknown>,
      )) {
        assignValue(childObject, key, value);
      }
      continue;
    }

    assignValue(childObject, "item", parsedChild);
  }

  return { [block.tag]: childObject };
}

export function xmlToObject(xml: string): unknown {
  const stripped = xml.replace(/<\?xml[^?]*\?>\s*/gi, "").trim();
  const parsed = parseNode(stripped);

  if (
    parsed !== null &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    "docshift" in (parsed as Record<string, unknown>)
  ) {
    return (parsed as Record<string, unknown>).docshift;
  }

  return parsed;
}
